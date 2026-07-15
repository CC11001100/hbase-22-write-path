/**
 * HBase 写路径全流程 — 步骤生成器
 *
 * 动画展示一次 Put 请求的端到端写链路：
 *   Client 定位 Region → RegionServer 接收 → 写 WAL(同步 sync)
 *   → 写 MemStore(同步, 有序) → ack 给 Client
 *   → MemStore 满 → flush 到 HFile(异步)
 * 重点突出"同步段(WAL + MemStore)保证持久性"与"异步段(flush)落盘"的区分。
 */
import type { Step, VisualElement, VariableState } from '../types'

/** 写路径伪代码 */
export const TEMPLATE_CODE = `// HBase 写路径：一次 Put 的同步与异步阶段
public void put(Put put) {
    // 1. Client 定位 Region 所在 RegionServer
    RegionServer rs = locate(put.getRow());

    // 2. RegionServer 接收请求，分配递增 seqNum
    long seq = assignSeqNum();

    // 3. 写 WAL（同步，预写日志，保证持久性）
    WALEdit edit = new WALEdit(put);
    wal.append(seq, edit);
    wal.sync();              // 同步刷盘

    // 4. 写 MemStore（同步，按 rowKey 有序写入）
    memStore.add(put);      // CellSkipListSet 有序结构

    // 5. ack 给 Client（写操作到此对客户端可见）
    ackToClient(put);       // 同步段结束

    // 6. 异步 flush：MemStore 满则生成 HFile 落盘
    if (memStore.isFull()) {
        flushToHFile(memStore);  // 异步，不阻塞 Client
    }
}`

// 画布布局常量（端到端写链路横向排布）
const LAYOUT = {
  client: { x: 40, y: 210, w: 130, h: 70, label: 'Client' },
  regionserver: { x: 230, y: 200, w: 180, h: 90, label: 'RegionServer' },
  wal: { x: 470, y: 90, w: 150, h: 70, label: 'WAL' },
  memstore: { x: 470, y: 210, w: 150, h: 80, label: 'MemStore' },
  hdfs: { x: 690, y: 210, w: 130, h: 70, label: 'HDFS' },
  hfile: { x: 850, y: 210, w: 130, h: 70, label: 'HFile' },
}

function makeElements(highlight?: string): VisualElement[] {
  const mk = (
    key: keyof typeof LAYOUT,
    type: string,
    state: string
  ): VisualElement => {
    const l = LAYOUT[key]
    return {
      id: key,
      type,
      label: l.label,
      x: l.x,
      y: l.y,
      width: l.w,
      height: l.h,
      state: key === highlight ? 'active' : state,
    }
  }
  return [
    mk('client', 'client', 'idle'),
    mk('regionserver', 'rs', 'idle'),
    mk('wal', 'wal', 'idle'),
    mk('memstore', 'memstore', 'idle'),
    mk('hdfs', 'hdfs', 'idle'),
    mk('hfile', 'hfile', 'idle'),
  ]
}

export function generateSteps(): Step[] {
  const steps: Step[] = []
  let idx = 0

  const push = (
    desc: string,
    line: number,
    vars: VariableState[],
    elements: VisualElement[],
    arrows: { from: string; to: string; label?: string }[] = [],
    actionLabel?: string,
    statusText?: string
  ) => {
    steps.push({
      index: idx++,
      description: desc,
      currentLine: line,
      variables: vars,
      elements,
      connections: arrows.map((a, i) => ({
        id: `arrow-${i}`,
        fromId: a.from,
        toId: a.to,
        kind: 'arrow' as const,
        label: a.label,
      })),
      annotations: [],
      actionLabel,
      statusText: statusText ?? desc,
    })
  }

  // 步骤 0：写路径总览
  push(
    '写路径全流程：Client → RegionServer → WAL(sync) → MemStore(sync) → ack → flush(HFile)',
    0,
    [],
    makeElements(),
    [
      { from: 'client', to: 'regionserver', label: 'Put' },
      { from: 'regionserver', to: 'wal', label: 'sync' },
      { from: 'regionserver', to: 'memstore', label: 'add' },
      { from: 'memstore', to: 'hfile', label: 'flush' },
      { from: 'hfile', to: 'hdfs', label: '存储' },
    ],
    'WRITE_PATH',
    '写路径总览'
  )

  // 步骤 1：Client 定位 Region
  push(
    'Client 发起 Put，先定位 RowKey 所属 Region 及其 RegionServer（Meta 缓存命中）',
    3,
    [{ name: 'rs', value: 'RS-2 (TableA-Region1)', line: 3, type: 'RegionServer' }],
    makeElements('client'),
    [{ from: 'client', to: 'regionserver', label: '1.定位 Region' }],
    'LOCATE',
    'Client 定位 Region'
  )

  // 步骤 2：RS 接收，分配 seqNum
  push(
    'RegionServer 接收请求，为本次写分配递增 seqNum（用于 WAL 与 MVCC）',
    6,
    [
      { name: 'rs', value: 'RS-2 (Region1)', line: 3, type: 'RegionServer' },
      { name: 'seq', value: '42', line: 6, type: 'long' },
    ],
    makeElements('regionserver'),
    [{ from: 'client', to: 'regionserver', label: '2.发送 Put' }],
    'RECEIVE',
    'RS 接收 + 分配 seqNum'
  )

  // 步骤 3：写 WAL（同步）
  push(
    '先写 WAL 预写日志：wal.append(seq, edit) 后立即 wal.sync() 同步刷盘，保证宕机可恢复',
    9,
    [
      { name: 'seq', value: '42', line: 6, type: 'long' },
      { name: 'edit', value: 'WALEdit(row1=...)', line: 8, type: 'WALEdit' },
      { name: 'walSynced', value: 'true', line: 10, type: 'boolean' },
    ],
    makeElements('wal').map((e) =>
      e.id === 'wal' ? { ...e, state: 'writing' } : e
    ),
    [{ from: 'regionserver', to: 'wal', label: '3.append+sync' }],
    'WAL_SYNC',
    '写 WAL (同步 sync)'
  )

  // 步骤 4：写 MemStore（同步，有序）
  push(
    'WAL 同步完成后写入 MemStore：memStore.add(put)，CellSkipListSet 按 rowKey 有序插入',
    13,
    [
      { name: 'walSynced', value: 'true', line: 10, type: 'boolean' },
      { name: 'memstore', value: '[row1, row3, row5]', line: 13, type: 'MemStore' },
      { name: 'memstoreSize', value: '64MB / 128MB', line: 13 },
    ],
    makeElements('memstore').map((e) =>
      e.id === 'memstore' ? { ...e, state: 'writing' } : e
    ),
    [{ from: 'regionserver', to: 'memstore', label: '4.add(有序)' }],
    'MEMSTORE',
    '写 MemStore (同步, 有序)'
  )

  // 步骤 5：ack 给 Client（同步段结束）
  push(
    'MemStore 写入完成 → ackToClient(put)：同步段结束，写操作对 Client 可见',
    16,
    [
      { name: 'memstoreSize', value: '64MB / 128MB', line: 13 },
      { name: 'ackedClient', value: 'true', line: 16, type: 'boolean' },
    ],
    makeElements('client').map((e) =>
      e.id === 'client' ? { ...e, state: 'active' } : e
    ),
    [{ from: 'regionserver', to: 'client', label: '5.ack (可见)' }],
    'ACK',
    'ack 给 Client'
  )

  // 步骤 6：异步 flush 触发条件
  push(
    'MemStore 大小达 flush 阈值(128MB)，触发异步 flush（不阻塞 Client 的后续写）',
    19,
    [
      { name: 'memstoreSize', value: '128MB (满)', line: 19 },
      { name: 'ackedClient', value: 'true', line: 16, type: 'boolean' },
    ],
    makeElements('memstore').map((e) =>
      e.id === 'memstore' ? { ...e, state: 'flushing' } : e
    ),
    [],
    'FLUSH_CHECK',
    'MemStore 满, 触发 flush'
  )

  // 步骤 7：flush 到 HFile（异步）
  push(
    '异步 flush：MemStore 有序数据生成 HFile，持久化到 HDFS；同时清理 MemStore',
    20,
    [
      { name: 'memstoreSize', value: '0MB (已清)', line: 20 },
      { name: 'hfile', value: '/hdfs/.../HFile-1', line: 20, type: 'HFile' },
    ],
    makeElements('hfile').map((e) => {
      if (e.id === 'hfile') return { ...e, state: 'writing' }
      if (e.id === 'memstore') return { ...e, state: 'done' }
      return e
    }),
    [
      { from: 'memstore', to: 'hfile', label: '6.flush HFile' },
      { from: 'hfile', to: 'hdfs', label: '7.落盘' },
    ],
    'FLUSH',
    'Flush 到 HFile (异步)'
  )

  // 步骤 8：完成
  push(
    '写路径完成：WAL + MemStore(同步) 保证持久性与可见性，flush(异步) 完成落盘',
    21,
    [
      { name: 'seq', value: '42', line: 6, type: 'long' },
      { name: 'walSynced', value: 'true', line: 10, type: 'boolean' },
      { name: 'ackedClient', value: 'true', line: 16, type: 'boolean' },
      { name: 'hfile', value: 'HFile-1 (落盘)', line: 20, type: 'HFile' },
    ],
    makeElements().map((e) =>
      e.id === 'hdfs' || e.id === 'hfile' ? { ...e, state: 'done' } : e
    ),
    [{ from: 'regionserver', to: 'hdfs', label: '已落盘' }],
    'DONE',
    '写路径完成'
  )

  return steps
}

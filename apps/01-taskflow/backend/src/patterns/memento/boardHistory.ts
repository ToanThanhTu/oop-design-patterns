import type { BoardSnapshot } from "#patterns/memento/boardSnapshot.js"

export class BoardHistory {
  private poppedSnapshots: BoardSnapshot[] = []
  private snapshots: BoardSnapshot[] = []

  public redo(): BoardSnapshot | undefined {
    const redone = this.poppedSnapshots.pop()

    if (redone) {
      this.snapshots.push(redone)
    }

    return redone
  }

  public save(boardSnapshot: BoardSnapshot): void {
    this.snapshots.push(boardSnapshot)
    this.poppedSnapshots = []
  }

  public undo(): BoardSnapshot | undefined {
    if (this.snapshots.length <= 1) {
      return undefined
    }

    const currentState = this.snapshots.pop()

    if (currentState) {
      this.poppedSnapshots.push(currentState)
    }

    return this.snapshots[this.snapshots.length - 1]
  }
}

import { SnakeCellComponent } from 'components/snake-cell';

interface MatrixHistory {
    chance: number;
    countCell: number;
    countDomain: number;
}

export class SnakeMatrixService {
    private static instance: SnakeMatrixService;
    private static maxHistoryLength: number = 10;
    allDomainCounter: number = 0;
    matrix: Array<Array<SnakeCellComponent>> = [];
    matrixHistory: Array<MatrixHistory> = [];

    constructor() {
        SnakeMatrixService.instance = SnakeMatrixService.instance || this;
        return SnakeMatrixService.instance;
    }

    calcDomain(): void {
        this.allDomainCounter = 0;
        this.matrix.forEach(row =>
            row.forEach(cell => cell.domainCount = 0)
        );
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const { checked, domainCount } = this.matrix[row][col];
                if (checked && !domainCount) {
                    this.allDomainCounter++;
                    this.recursiveChair(row, col);
                }
            }
        }
    }

    generateMatrix(rowLength: number, colLength: number, chance?: number): void {
        chance = chance / 100;
        this.matrix.length = rowLength;
        this.matrix = this.matrix.fill(null, 0, rowLength).map(() =>
            new Array(colLength).fill(null).map(() => {
                const cell = new SnakeCellComponent();
                const r = Math.random();
                chance && (cell.checked = r <= chance
                );
                return cell;
            })
        );
        this.calcDomain();
        chance && this.pushMatrixHistory(chance, rowLength, colLength);
    }

    pushMatrixHistory(chance: number, row: number, col: number): void {
        const { maxHistoryLength } = SnakeMatrixService;
        this.matrixHistory.push({
            chance,
            countCell: row * col,
            countDomain: this.allDomainCounter
        });
        const len = this.matrixHistory.length - maxHistoryLength;
        len > 0 && this.matrixHistory.splice(0, len);
    }

    recursiveChair(row: number, col: number): void {
        const cell = this.matrix[row][col];
        if (cell.domainCount || !cell.checked) {
            return;
        }
        cell.domainCount = this.allDomainCounter;

        const rowLen = this.matrix.length - 1;
        const colLen = this.matrix[0].length - 1;

        if (row > 0) {
            this.recursiveChair(row - 1, col);
        }
        if (row < rowLen) {
            this.recursiveChair(row + 1, col);
        }
        if (col > 0) {
            this.recursiveChair(row, col - 1);
        }
        if (col < colLen) {
            this.recursiveChair(row, col + 1);
        }
    }
}

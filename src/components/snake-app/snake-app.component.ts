import { SnakeHistoryComponent } from 'components/snake-history';
import { SnakeInputComponent } from 'components/snake-input';
import { SnakeMatrixComponent } from 'components/snake-matrix';
import { SnakeRegistryComponent } from 'decorators';
import { SnakeMatrixService } from 'services';
import { SnakeComponent } from 'snake.component';
import template from './snake-app.component.html';
import styles from './snake-app.component.styl';

@SnakeRegistryComponent({
    selector: 'snake-app',
    styles
})
export class SnakeAppComponent extends SnakeComponent {
    private chanceFild: SnakeInputComponent;
    private historyTable: SnakeHistoryComponent;
    private matrix: SnakeMatrixComponent;
    private randBtn: HTMLElement;
    private refreshBtn: HTMLElement;
    private countDomainBlock: HTMLElement;
    className: string = 'snake-app';
    countCol: number = 5;
    countRow: number = 5;
    innerHTML: string = template;
    matrixService: SnakeMatrixService;

    constructor() {
        super();
        this.refreshBtn = document.getElementById('snake-refresh');
        this.randBtn = document.getElementById('snake-rand-calc');
        this.matrix = document.getElementById('snake-matrix') as SnakeMatrixComponent;
        this.chanceFild = document.getElementById('snake-app-rand-chance') as SnakeInputComponent;
        this.historyTable = document.getElementById('snake-history') as SnakeHistoryComponent;
        this.countDomainBlock = document.getElementById('snake-app-count-domain');
        this.matrixService = new SnakeMatrixService();
    }

    randCalcMatrix(): void {
        this.matrixService.generateMatrix(this.countRow, this.countCol, +this.chanceFild.value);
        this.matrix.renderMatrix(this.matrixService.matrix);
        this.updateCountDomain();
        this.historyTable.renderHistory();

    }

    refreshMatrix(): void {
        this.matrixService.generateMatrix(this.countRow, this.countCol);
        this.matrix.renderMatrix(this.matrixService.matrix);
        this.countDomainBlock.innerText = '0';
    }

    updateCountDomain(): void {
        this.matrixService.calcDomain();
        this.countDomainBlock.innerText = this.matrixService.allDomainCounter + '';
    }

    setCountCol(value: string): void {
        this.countCol = +value;
    }

    setCountRow(value: string): void {
        this.countRow = +value;
    }
}

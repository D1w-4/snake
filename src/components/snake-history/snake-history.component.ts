import { SnakeRegistryComponent } from 'decorators';
import { SnakeMatrixService } from 'services';
import { SnakeComponent } from 'snake.component';
import template from './snake-history.component.html';
import styles from './snake-history.component.styl';

@SnakeRegistryComponent({
    selector: 'snake-history',
    styles
})
export class SnakeHistoryComponent extends SnakeComponent {
    hidden: boolean = true;
    innerHTML: string = template;
    matrixService: SnakeMatrixService;

    private static makeCell(text: string): HTMLElement {
        const cell = document.createElement('td');
        cell.innerText = text;
        return cell;
    }

    private static makeRow(): HTMLElement {
        return document.createElement('tr');
    }

    constructor() {
        super();
        this.matrixService = new SnakeMatrixService();
    }

    renderHistory(): void {
        const { makeRow, makeCell } = SnakeHistoryComponent;
        const tbody = this.querySelector('tbody');
        tbody.innerHTML = '';
        this.matrixService.matrixHistory
            .forEach(({ chance, countCell, countDomain }) => {
                const row = makeRow();
                [chance, countDomain, countCell]
                    .forEach(v => {
                        row.appendChild(makeCell(v + ''));
                    });
                tbody.appendChild(row);
            });

        this.hidden = !this.matrixService.matrixHistory.length;
    }
}

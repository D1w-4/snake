import { SnakeCellComponent } from 'components/snake-cell';
import { SnakeRegistryComponent } from 'decorators';
import { SnakeComponent } from 'snake.component';
import styles from './snake-matrix.component.styl';

@SnakeRegistryComponent({
    selector: 'snake-matrix',
    styles
})
export class SnakeMatrixComponent extends SnakeComponent {

    private static makeRow(): HTMLElement {
        const row = document.createElement('div');
        row.className = 'snake-matrix__row';
        return row;
    }

    renderMatrix(matrix: Array<Array<SnakeCellComponent>>): void {
        const { makeRow } = SnakeMatrixComponent;
        const fragment = document.createDocumentFragment();
        matrix.forEach(row => {
            const rowEl = makeRow();
            row.forEach(cell => {
                rowEl.appendChild(cell);
            });
            fragment.appendChild(rowEl);
        });
        this.innerHTML = '';
        this.appendChild(fragment);
    }
}

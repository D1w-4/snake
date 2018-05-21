import { SnakeRegistryComponent } from 'decorators';
import { SnakeMatrixService } from 'services';
import { SnakeComponent } from 'snake.component';
import template from './snake-cell.component.html';
import styles from './snake-cell.component.styl';

interface Rgba {
    a: number;
    b: number;
    g: number;
    r: number;
}

@SnakeRegistryComponent({
    selector: 'snake-cell',
    styles
})
export class SnakeCellComponent extends SnakeComponent {
    private static rgbColorList: Array<Rgba> = [];
    className: string = 'snake-cell';
    innerHTML: string = template;
    matrixService: SnakeMatrixService;

    private _checked: boolean = false;

    get checked(): boolean {
        return this._checked;
    }

    set checked(value: boolean) {
        this._checked = value;
        this.toggleChecked();
    }

    private _domainCount: number = 0;

    get domainCount(): number {
        return this._domainCount;
    }

    set domainCount(value: number) {
        this._domainCount = value;
        this.setColor(value);
    }

    private static inverseColor(color: Rgba): Rgba {
        const inverseColor = Object.create(color);
        Object.keys(color).forEach(key => inverseColor[key] = 255 - color[key]);
        return inverseColor;
    }

    private static makeColor(): Rgba {
        const makeChanel = (): number => Math.random() * 100 * 2.55;
        const color = {
            r: makeChanel(),
            g: makeChanel(),
            b: makeChanel(),
            a: Math.random()
        };
        SnakeCellComponent.rgbColorList.push(color);
        return color;
    }

    private static colorToStr({ r, g, b, a }: Rgba): string {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    constructor() {
        super();
        this.matrixService = new SnakeMatrixService();
        this.addEventListener('click', () => {
            this.checked = !this.checked;
        });
    }

    private setColor(colorIndex: number): void {
        const { colorToStr, inverseColor, makeColor, rgbColorList } = SnakeCellComponent;
        const color = rgbColorList[colorIndex] || makeColor();
        this.style.background = colorToStr(color);
        this.style.color = colorToStr(
            inverseColor(rgbColorList[colorIndex])
        );
    }

    toggleChecked(): void {
        this.classList.toggle('snake-cell--checked', this.checked);
        this.domainCount = 0;
    }
}

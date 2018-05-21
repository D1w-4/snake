import { SnakeRegistryComponent } from 'decorators';
import { SnakeComponent } from 'snake.component';
import template from './snake-input.component.html';
import styles from './snake-input.component.styl';

enum Attr {
    LABEL = 'label',
    MAX = 'max',
    MIN = 'min',
    VALUE = 'value'
}

@SnakeRegistryComponent({
    selector: 'snake-input',
    styles
})
export class SnakeInputComponent extends SnakeComponent {
    private input: HTMLInputElement;
    innerHTML: string = template;
    max: number;
    min: number;

    static get observedAttributes(): Array<string> {
        return Object.values(Attr);
    }

    get value(): string {
        return this.input.value;
    }

    set value(value: string) {
        this.input.value = value;
    }

    constructor() {
        super();
        this.input = this.querySelector('input');
        this.input.addEventListener('change', () => {
            let value = +this.input.value;
            value = Math.min(value, this.max);
            value = Math.max(value, this.min);

            this.input.value = value + '';
            this.dispatchEvent(new Event('change'));
        });
    }

    attributeChangedCallback(name: Attr, oldValue: string, value: string): void {
        switch (name) {
        case Attr.LABEL:
            this.querySelector('label').innerText = value;
            break;
        case Attr.VALUE:
            this.input.value = value;
            break;
        case Attr.MAX:
        case Attr.MIN:
            this.input.setAttribute(name, value);
            this[name] = +value;
        }
    }
}

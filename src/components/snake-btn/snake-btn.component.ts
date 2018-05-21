import { SnakeRegistryComponent } from 'decorators';
import { SnakeComponent } from 'snake.component';
import template from './snake-btn.component.html';
import styles from './snake-btn.component.styl';

export enum Attr {
    DISABLED = 'disabled'
}

@SnakeRegistryComponent({
    selector: 'snake-btn',
    styles
})
export class SnakeBtnComponent extends SnakeComponent {
    btn: HTMLButtonElement;
    innerHTML: string;

    static get observedAttributes(): Array<string> {
        return Object.values(Attr);
    }

    constructor() {
        super();
        const transcludeHtml = this.innerHTML;
        this.innerHTML = template;
        this.btn = this.querySelector('button');
        this.btn.innerHTML = transcludeHtml;
    }

    attributeChangedCallback(name: Attr, oldValue: string, value: string): void {
        value ? this.btn.setAttribute(name, value) : this.btn.removeAttribute(name);
    }
}

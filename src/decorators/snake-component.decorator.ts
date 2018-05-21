import { SnakeComponent } from 'snake.component';

export interface SnakeRegistryData {
    selector: string;
    template?: string;
    styles?: string;
}

export function SnakeRegistryComponent(data: SnakeRegistryData): any {
    return (target: any): any => {
        window.customElements.define(data.selector, target);
        SnakeComponent.registryComponents(target, data);
    };
}

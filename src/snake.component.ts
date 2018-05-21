import { SnakeRegistryData } from 'decorators';

export abstract class SnakeComponent extends HTMLElement {
    private static registeredComponentList: Record<string, [object, SnakeRegistryData]> = {};
    $SnakeScope: HTMLElement;
    selector: string;

    private static findScope(el: HTMLElement): HTMLElement {
        if (!el) return null;
        if (el instanceof SnakeComponent) {
            return el;
        }
        return SnakeComponent.findScope(el.parentElement);
    }

    static registryComponents(component: SnakeComponent, { selector }: SnakeRegistryData): void {
        const { registeredComponentList } = SnakeComponent;
        if (selector in registeredComponentList) {
            console.error(`Комопонет ${selector} уже зарегистрированн`, component);
            return;
        }
        registeredComponentList[selector] = [component, { selector }];
    }

    constructor() {
        super();
        this.$SnakeScope = SnakeComponent.findScope(this.parentElement);
    }
}

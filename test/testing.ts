import { vi } from "vitest";

export function spyAllMethodsOf<T extends object>(element: T): void {
    const proto = Object.getPrototypeOf(element);

    // Get all property names from the class prototype
    const propertyNames = Object.getOwnPropertyNames(proto);

    for (const name of propertyNames) {
        // We only want to spy on methods (functions), not the constructor
        if (name !== 'constructor' && typeof (element as any)[name] === 'function') {
            // Overwrite the method on the instance with a vitest mock
            (element as any)[name] = vi.fn();
        }
    }
}
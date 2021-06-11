import { INJECT_ARG_INDEX, TARGET_INJECTABLE } from "./constants";

export class Container {
  static targets: { [key: string]: any } = {};

  static bind(key: string, value: any) {
    this.targets[key] = value;
  }

  static get(key: string) {
    return this.targets[key] || {};
  }

  static factory<T>(c: any): T {
    const args: Function[] = Reflect.getMetadata("design:paramtypes", c);
    const replaceArgs = Reflect.getMetadata(INJECT_ARG_INDEX, c) || [];
    replaceArgs.forEach(
      ({ index, identifier }: { index: number; identifier: string }) => {
        args[index] = Container.get(identifier) || {};
      }
    );
    return new c(
      ...(args?.map((arg) =>
        typeof arg === "object" && Reflect.getMetadata(TARGET_INJECTABLE, arg)
          ? this.factory(arg)
          : arg
      ) || [])
    );
  }
}

import { JSX } from 'solid-js/jsx-runtime';
import {
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  useContext,
} from 'solid-js';
import {
  Dynamic,
} from 'solid-js/web';
import {
  HeadlessToggleChild,
  HeadlessToggleChildProps,
  HeadlessToggleRoot,
  HeadlessToggleRootProps,
  useHeadlessToggleChild,
} from '../headless/Toggle';
import { DynamicProps, ValidConstructor } from '../utils/dynamic-prop';
import { excludeProps } from '../utils/exclude-props';
import Fragment from '../utils/Fragment';

interface TailwindCheckboxContext {
  ownerID: string;
  labelID: string;
  indicatorID: string;
  descriptionID: string;
}

const TailwindCheckboxContext = createContext<TailwindCheckboxContext>();

function useTailwindCheckboxContext(componentName: string): TailwindCheckboxContext {
  const context = useContext(TailwindCheckboxContext);

  if (context) {
    return context;
  }
  throw new Error(`<${componentName}> must be used inside a <TailwindCheckbox>`);
}

export type TailwindCheckboxProps<T extends ValidConstructor = typeof Fragment> = {
  as?: T;
} & HeadlessToggleRootProps
  & Omit<DynamicProps<T>, keyof HeadlessToggleRootProps>;

export function TailwindCheckbox<T extends ValidConstructor = typeof Fragment>(
  props: TailwindCheckboxProps<T>,
): JSX.Element {
  const ownerID = createUniqueId();
  const labelID = createUniqueId();
  const indicatorID = createUniqueId();
  const descriptionID = createUniqueId();

  return (
    <TailwindCheckboxContext.Provider
      value={{
        ownerID,
        labelID,
        indicatorID,
        descriptionID,
      }}
    >
      <Dynamic
        component={props.as ?? Fragment}
        {...excludeProps(props, [
          'checked',
          'as',
          'children',
          'disabled',
          'defaultChecked',
          'onChange',
        ])}
        data-sh-checkbox={ownerID}
      >
        <HeadlessToggleRoot
          checked={props.checked}
          onChange={props.onChange}
          disabled={props.disabled}
          defaultChecked={props.defaultChecked}
        >
          {props.children}
        </HeadlessToggleRoot>
      </Dynamic>
    </TailwindCheckboxContext.Provider>
  );
}

export type TailwindCheckboxIndicatorProps<T extends ValidConstructor = 'button'> = {
  as?: T;
} & HeadlessToggleChildProps
  & Omit<DynamicProps<T>, keyof HeadlessToggleChildProps>;

export function TailwindCheckboxIndicator<T extends ValidConstructor = 'button'>(
  props: TailwindCheckboxIndicatorProps<T>,
): JSX.Element {
  const context = useTailwindCheckboxContext('TailwindCheckboxIndicator');
  const state = useHeadlessToggleChild();

  const [internalRef, setInternalRef] = createSignal<HTMLElement>();

  createEffect(() => {
    const ref = internalRef();

    if (ref) {
      const toggle = () => {
        state.setState(!state.checked());
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === ' ') {
          toggle();
        }
      };

      ref.addEventListener('click', toggle);
      ref.addEventListener('keydown', onKeyDown);
      onCleanup(() => {
        ref.removeEventListener('click', toggle);
        ref.removeEventListener('keydown', onKeyDown);
      });
    }
  });

  return (
    <Dynamic
      component={props.as ?? 'button'}
      {...excludeProps(props, [
        'as',
        'children',
      ])}
      role="checkbox"
      aria-checked={state.checked() == null ? 'mixed' : state.checked()}
      data-sh-checkbox-indicator={context.ownerID}
      id={context.indicatorID}
      aria-labelledby={context.labelID}
      aria-describedby={context.descriptionID}
      disabled={state.disabled()}
      tabindex={0}
      ref={(e) => {
        const outerRef = props.ref;
        if (typeof outerRef === 'function') {
          outerRef(e);
        } else {
          props.ref = e;
        }
        setInternalRef(e);
      }}
    >
      <HeadlessToggleChild>
        {props.children}
      </HeadlessToggleChild>
    </Dynamic>
  );
}

export type TailwindCheckboxLabelProps<T extends ValidConstructor = 'label'> = {
  as?: T;
} & HeadlessToggleChildProps
  & Omit<DynamicProps<T>, keyof HeadlessToggleChildProps>;

export function TailwindCheckboxLabel<T extends ValidConstructor = 'label'>(
  props: TailwindCheckboxLabelProps<T>,
): JSX.Element {
  const context = useTailwindCheckboxContext('TailwindCheckboxLabel');
  return (
    <Dynamic
      component={props.as ?? 'label'}
      {...excludeProps(props, [
        'as',
      ])}
      id={context.labelID}
      data-sh-checkbox-label={context.ownerID}
    >
      {props.children}
    </Dynamic>
  );
}

export type TailwindCheckboxDescriptionProps<T extends ValidConstructor = 'p'> = {
  as?: T;
} & HeadlessToggleChildProps
  & Omit<DynamicProps<T>, keyof HeadlessToggleChildProps>;

export function TailwindCheckboxDescription<T extends ValidConstructor = 'p'>(
  props: TailwindCheckboxDescriptionProps<T>,
): JSX.Element {
  const context = useTailwindCheckboxContext('TailwindCheckboxDescription');

  return (
    <Dynamic
      component={(props.as ?? 'p') as T}
      {...excludeProps(props, [
        'as',
        'children',
      ])}
      id={context.descriptionID}
      data-sh-checkbox-description={context.ownerID}
    >
      <HeadlessToggleChild>
        {props.children}
      </HeadlessToggleChild>
    </Dynamic>
  );
}

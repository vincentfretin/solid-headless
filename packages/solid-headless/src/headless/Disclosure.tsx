import {
  createContext,
  createEffect,
  createSignal,
  JSX,
  untrack,
  useContext,
} from 'solid-js';

export interface HeadlessDisclosureOptions {
  isOpen?: boolean;
  initialOpen?: boolean;
}

export type HeadlessDisclosureProperties = [
  () => boolean,
  (newState: boolean) => void,
];

export function useHeadlessDisclosure(
  options: HeadlessDisclosureOptions = {},
): HeadlessDisclosureProperties {
  const [signal, setSignal] = createSignal(untrack(() => !!options.initialOpen));

  createEffect(() => {
    setSignal(!!options.isOpen);
  });

  return [
    signal,
    setSignal,
  ];
}

const HeadlessDisclosureContext = createContext<HeadlessDisclosureProperties>();

export interface DisclosureRootProps extends HeadlessDisclosureOptions {
  children: ((...properties: HeadlessDisclosureProperties) => JSX.Element) | JSX.Element;
}

export function HeadlessDisclosureRoot(props: DisclosureRootProps): JSX.Element {
  const properties = useHeadlessDisclosure(props);
  if (typeof props.children === 'function') {
    return (
      <HeadlessDisclosureContext.Provider value={properties}>
        {props.children(...properties)}
      </HeadlessDisclosureContext.Provider>
    );
  }
  return (
    <HeadlessDisclosureContext.Provider value={properties}>
      {props.children}
    </HeadlessDisclosureContext.Provider>
  );
}

export function useHeadlessDisclosureChild(): HeadlessDisclosureProperties {
  const properties = useContext(HeadlessDisclosureContext);
  if (properties) {
    return properties;
  }
  throw new Error('`useDisclosureChild` must be used within DisclosureRoot.');
}

export interface HeadlessDisclosureChildProps {
  children: (...properties: HeadlessDisclosureProperties) => JSX.Element;
}

export function HeadlessDisclosureChild(props: HeadlessDisclosureChildProps): JSX.Element {
  return props.children(...useHeadlessDisclosureChild());
}

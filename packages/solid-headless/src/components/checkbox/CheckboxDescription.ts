import {
  JSX,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import {
  HeadlessToggleChildProps,
} from '../../headless/toggle';
import createDynamic from '../../utils/create-dynamic';
import {
  DynamicProps,
  HeadlessProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  useCheckboxContext,
} from './CheckboxContext';

export type CheckboxDescriptionProps<T extends ValidConstructor = 'p'> =
  HeadlessProps<T, HeadlessToggleChildProps>;

export function CheckboxDescription<T extends ValidConstructor = 'p'>(
  props: CheckboxDescriptionProps<T>,
): JSX.Element {
  const context = useCheckboxContext('CheckboxDescription');
  return createDynamic(
    () => props.as ?? ('p' as T),
    mergeProps(
      omitProps(props, [
        'as',
        'children',
      ]),
      {
        id: context.descriptionID,
        'data-sh-checkbox-description': context.ownerID,
      },
    ) as DynamicProps<T>,
  );
}

import { PropertyValue } from '@stitches/react';

export const utils = {
  m: (value: PropertyValue<'margin'>) => ({
    margin: value,
  }),
  mt: (value: PropertyValue<'marginTop'>) => ({
    marginTop: value,
  }),
  mb: (value: PropertyValue<'marginBottom'>) => ({
    marginBottom: value,
  }),
  my: (value: PropertyValue<'marginTop' | 'marginBottom'>) => ({
    marginTop: value,
    marginBottom: value,
  }),
  ml: (value: PropertyValue<'marginLeft'>) => ({
    marginLeft: value,
  }),
  mr: (value: PropertyValue<'marginRight'>) => ({
    marginRight: value,
  }),
  mx: (value: PropertyValue<'marginLeft' | 'marginRight'>) => ({
    marginLeft: value,
    marginRight: value,
  }),
  p: (value: PropertyValue<'margin'>) => ({
    padding: value,
  }),
  pt: (value: PropertyValue<'paddingTop'>) => ({
    paddingTop: value,
  }),
  pb: (value: PropertyValue<'paddingBottom'>) => ({
    paddingBottom: value,
  }),
  py: (value: PropertyValue<'paddingTop' | 'paddingBottom'>) => ({
    paddingTop: value,
    paddingBottom: value,
  }),
  pl: (value: PropertyValue<'paddingLeft'>) => ({
    paddingLeft: value,
  }),
  pr: (value: PropertyValue<'paddingRight'>) => ({
    paddingRight: value,
  }),
  px: (value: PropertyValue<'paddingLeft' | 'paddingRight'>) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  inset: (value: PropertyValue<'top' | 'bottom' | 'left' | 'right'>) => ({
    top: value,
    bottom: value,
    left: value,
    right: value,
  }),
};

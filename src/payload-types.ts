import { Description } from "payload/dist/admin/components/forms/FieldDescription/types";
import { Condition, FieldBase, TextField } from "payload/types";
import { CSSProperties } from "react";
import GooglePlacesAutocompleteProps from "react-google-places-autocomplete/build/types";


export type GoogleMapsAutoCompleteField =  Omit<TextField, 'type' | "maxLength" | "minLength" | "hasMany" | "maxRows" | 'minRows' | 'admin'> & Omit<GooglePlacesAutocompleteProps,"apiKey"> &{
  latLng?: boolean | {showFields?: boolean, name: string, label?: string, admin?: FieldBase['admin'], access?:FieldBase['access']};
  apiKey: string;
  admin?: FieldBase['admin']
}


export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
}

export interface LatLng {
  lat: number;
  lng: number;
}
export interface AutocompletionRequest {
  bounds?: [LatLng, LatLng];
  componentRestrictions?: { country: string | string[] };
  location?: LatLng;
  offset?: number;
  radius?: number;
  types?: string[];
}
import {
  Error,
  FieldDescription,
  Label,
  Select,
  SelectInput,
  TextInput,
  useField,
  useFieldType,
} from "payload/components/forms";
import React, { useCallback, useEffect } from "react";
import "./styles.scss";
import { GoogleMapsAutoCompleteField } from "../payload-types";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import Chevron from "payload/dist/admin/components/icons/Chevron";
import { ClearIndicator } from "payload/dist/admin/components/elements/ReactSelect/ClearIndicator/index";
import { DocumentPermissions } from "payload/dist/admin/components/utilities/DocumentInfo/types";
import { CollectionPermission, FieldPermissions } from "payload/dist/auth";
import { Access, Condition, FieldAccess, FieldBase } from "payload/types";
import { Description } from "payload/dist/admin/components/forms/FieldDescription/types";
import GooglePlacesAutocompleteProps from "react-google-places-autocomplete/build/types";
import { select, point } from "payload/dist/fields/validations";

export const AutoCompleteSelectField: (
  config: GooglePlacesAutocompleteProps & {
    apiKey: string;
    name: string;
    point_path: string | null;
    path: string;
    label: string;
    required: boolean;
  }
) => React.FC<{
  apiKey: string;
  name: string;
  point_path: string | null;
  path: string;
  label: string;
  required: boolean;
}> = (config) => {
  const AutoCompleteSelect: React.FC<{
    path: string;
    label: string;
    required: boolean;
    admin?: FieldBase["admin"] & {
      placeholder?: string;
    };
    name: string;
  }> = (prop) => {
    const {
      apiKey,
      point_path = "",
      onLoadFailed = () => {},
      apiOptions,
      minLengthAutocomplete,
      autocompletionRequest,
      debounce = 300,
      withSessionToken,
    } = config || {};
    const { name, path, label, required = false, admin } = prop;
    const rawDatapath = path + "_rawData";
    const pointPath = point_path ?? "";

    const validate = select;

    const memoizedValidate = useCallback(
      (value: any, validationOptions: any) => {
        console.log(value, validationOptions);
        return validate(value, {
          ...validationOptions,
          required,
        });
      },
      [validate, required]
    );

    const memoizedPointsValidate = useCallback(
      (value: any, validationOptions: any) => {
        return point(value, {
          ...validationOptions,
          required,
        });
      },
      [point, required]
    );

    const { value, setValue, showError, errorMessage } = useField({
      path,
      validate: memoizedValidate,
    });
    const { value: rawDataValue, setValue: rawDataSetValue } = useField({
      path: rawDatapath,
    });
    const { setValue: pointSetValue } = useField({
      path: pointPath,
      validate: memoizedPointsValidate,
    });
    const { description, readOnly } = admin || {};

    const classes = [
      "react-select",
      showError && "react-select--error",
      readOnly && "read-only",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`field-type select ${showError ? "error" : ""}`}>
        {errorMessage && <Error message={errorMessage} showError={showError} />}
        <Label htmlFor={path} label={label} required={required} />
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          apiOptions={apiOptions}
          onLoadFailed={onLoadFailed}
          minLengthAutocomplete={minLengthAutocomplete}
          autocompletionRequest={autocompletionRequest}
          debounce={debounce}
          withSessionToken={withSessionToken}
          selectProps={{
            required,
            className: classes,
            cacheOptions: true,
            classNamePrefix: "rs",
            isClearable: true,
            isDisabled: readOnly,

            onChange: (__value) => {
              if (__value === null) {
                pointSetValue([]);
              }
              setValue(__value?.label);
              rawDataSetValue(__value);
              if (point_path != null && __value) {
                geocodeByAddress(__value.label)
                  .then((results) => {
                    return getLatLng(results[0]);
                  })
                  .then(({ lng, lat }) => pointSetValue([lng, lat]));
              }
            },
            value: rawDataValue as any,
            components: {
              DropdownIndicator: Chevron,
              ClearIndicator: ClearIndicator as any,
            },
            placeholder: admin?.placeholder ?? "Please Select...",
          }}
        />
        <FieldDescription
          className={`field-description-${path.replace(/\./g, "__")}`}
          description={description}
          path={path}
          value={value}
        />
      </div>
    );
  };

  return AutoCompleteSelect;
};

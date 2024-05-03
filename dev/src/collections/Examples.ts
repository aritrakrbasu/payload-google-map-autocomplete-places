import { CollectionConfig } from 'payload/types';
import { googleMapAutoCompletePlaces } from '../../../src';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Examples: CollectionConfig = {
  slug: 'examples',
  admin: {
    useAsTitle: 'someField',
  },
  fields: [
    {
      name: 'someField',
      type: 'text',
    },
    {
      name: 'someField2',
      type: 'select',
      access: {
        // create:() => false,
        // read:() => false,
        // update:() => false
      },
      options: [
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
      ],
    },
    ...googleMapAutoCompletePlaces({
      apiKey: "<google maps API Key Goes Here>",
      name: 'google_location',
      label: 'Google Location',
      required: true,
      admin:{
        description: "Please enter a valid api key",
        disabled: false,
        hidden: false,
        position: 'sidebar',
        readOnly:false,
        
      },
      access:{
        // create:() => false,
        // read:() => false,
        // update:() => false
      },
      latLng :{
        showFields: true,
        name: 'latlng',
        label: "location coordinates",

        admin:{
        description: "hi",
        disabled: false,
        hidden: false,
        position: 'sidebar',
        readOnly:false,
        
      },
      access:{
        create:() => false,
        // read:() => false,
        update:() => false
      },
      }
    })
  ],
}

export default Examples;
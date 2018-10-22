import { configure, addDecorator } from "@storybook/react";
import React from "react";
import { withNotes } from '@storybook/addon-notes';

import 'tachyons/css/tachyons.min.css';

// automatically import all files ending in *.stories.js
const req = require.context("../components/", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

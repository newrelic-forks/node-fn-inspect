/*
 * Copyright 2025 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
const testMod = module.exports

testMod.arrow = () => {
  const a = 'test'
  return a
}

testMod.named = function named() {}

testMod.anon = function () {}

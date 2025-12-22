#!/bin/sh
if [ -z "$HUSKY" ]; then
  exec "$HUSKY" "husky" "$0" "$@"
  exit 1
fi
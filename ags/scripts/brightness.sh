#!/bin/bash

while read -r line; do
    grep -q "video/brightness" <<<"${line}" && brightnessctl g || :
done < <(acpi_listen)

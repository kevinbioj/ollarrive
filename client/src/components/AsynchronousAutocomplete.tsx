import { Autocomplete, AutocompleteProps } from "@mui/joy";
import { useEffect, useState } from "react";

type AsynchronousAutocompleteProps<
  T,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  "onInputChange" | "options"
> & {
  fetchOptions: (input: string) => Promise<T[]>;
};

export default function AsynchronousAutocomplete<
  T,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean
>({
  fetchOptions,
  ...props
}: AsynchronousAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);

  useEffect(() => {
    fetchOptions(input).then(setOptions);
  }, [fetchOptions, input]);

  return (
    <Autocomplete
      filterOptions={(x) => x}
      onInputChange={(_, input) => setInput(input)}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      {...props}
    />
  );
}

import React, { ReactElement, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  FormLabel,
  MenuItem,
  OutlinedInput,
  OutlinedInputProps,
  Radio,
  Select,
  Theme,
  styled,
  useTheme,
} from '@material-ui/core';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@material-ui/icons';

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  '& .MuiFormControlLabel-label': {
    fontWeight: '700',
  },
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  margin: 0,
  fontSize: 16,
  color: theme.palette.text.primary,
  '&:not(:first-child)': {
    marginTop: theme.spacing(1),
  },
}));

const SharedFieldStyles = ({ theme }: { theme: Theme }) => ({
  '&:not(:first-child)': {
    marginTop: theme.spacing(1),
  },
});

const StyledOutlinedInput = styled(OutlinedInput)(SharedFieldStyles);
const StyledSelect = styled(Select)(SharedFieldStyles);

export const PersPrefForm: React.FC = ({ children }) => {
  const theme = useTheme();
  return (
    <form>
      {children}
      <Button
        style={{ marginTop: theme.spacing(2) }}
        variant="contained"
        color="primary"
        disableElevation
      >
        Save
      </Button>
    </form>
  );
};

// interface PersPrefFieldWrapperProps {
//   label?: string;
//   required?: boolean;
//   disabled?: boolean;
//   helperText?: string;
//   helperPosition?: string;
// }

// const PersPrefFieldWrapper: React.FC<PersPrefFieldWrapperProps> = ({
//   label,
//   required,
//   disabled,
//   helperText,
//   helperPosition,
//   children,
// }) => {
//   return (
//     <FormControl variant="outlined" disabled={disabled} fullWidth>
//       {label !== '' && (
//         <StyledFormLabel required={required}>{label}</StyledFormLabel>
//       )}
//       {helperText !== '' && helperPosition === 'top' && (
//         <StyledFormHelperText>{helperText}</StyledFormHelperText>
//       )}
//       {children}
//       {helperText !== '' && helperPosition === 'bottom' && (
//         <StyledFormHelperText>{helperText}</StyledFormHelperText>
//       )}
//     </FormControl>
//   );
// };

// interface PersPrefHelperWrapperProps {
//   text?: string;
//   position?: string;
// }

// const PersPrefHelperWrapper: React.FC<PersPrefHelperWrapperProps> = ({
//   text = '',
//   position = 'top',
//   children,
// }) => {
//   return (
//     <>
//       {text !== '' && position === 'top' && (
//         <StyledFormHelperText>{text}</StyledFormHelperText>
//       )}
//       {children}
//       {text !== '' && position === 'bottom' && (
//         <StyledFormHelperText>{text}</StyledFormHelperText>
//       )}
//     </>
//   );
// };

// interface PersPrefInputProps extends PersPrefFieldWrapperProps {
//   type?: string;
//   value?: string;
//   placeholder?: string;
//   startIcon?: OutlinedInputProps['startAdornment'];
// }

// export const PersPrefInput: React.FC<PersPrefInputProps> = ({
//   label = '',
//   required = false,
//   disabled = false,
//   helperText = '',
//   helperPosition = 'top',
//   type = 'text',
//   value = '',
//   placeholder = '',
//   startIcon = '',
// }) => {
//   return (
//     <PersPrefFieldWrapper
//       label={label}
//       required={required}
//       disabled={disabled}
//       helperText={helperText}
//       helperPosition={helperPosition}
//     >
//       <StyledOutlinedInput
//         type={type}
//         required={required}
//         value={value}
//         placeholder={placeholder}
//         startAdornment={startIcon}
//       />
//     </PersPrefFieldWrapper>
//   );
// };

interface PersPrefFieldProps {
  label?: string;
  helperText?: string;
  helperPosition?: string;
  type?: string;
  inputType?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputStartIcon?: OutlinedInputProps['startAdornment'] | boolean;
  options?: string[][];
  selectValue?: string;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
  checkboxIcon?: ReactElement;
  checkboxCheckedIcon?: ReactElement;
  radioName?: string;
  radioValue?: string;
  radioIcon?: ReactElement;
  radioCheckedIcon?: ReactElement;
  checked?: boolean;
  required?: boolean;
  // onChange?: () => void;
  className?: string;
  disabled?: boolean;
}

export const PersPrefField: React.FC<PersPrefFieldProps> = ({
  label = '',
  helperText = '',
  helperPosition = 'top',
  type = 'input',
  inputType = 'text',
  inputValue = '',
  inputPlaceholder = '',
  inputStartIcon = false,
  options = [
    ['option1', 'Option 1'],
    ['option2', 'Option 2'],
    ['option3', 'Option 3'],
    ['option4', 'Option 4'],
    ['option5', 'Option 5'],
  ],
  selectValue = options[0][0],
  labelPlacement = 'end',
  checkboxIcon = <CheckBoxOutlineBlank />,
  checkboxCheckedIcon = <CheckBox />,
  radioName = '',
  radioValue = '',
  radioIcon = <RadioButtonUnchecked />,
  radioCheckedIcon = <RadioButtonChecked />,
  checked = false,
  required = false,
  // onChange,
  className = '',
  disabled = false,
}) => {
  const [selectValueState, setSelectValueState] = useState(selectValue);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectValueState(event.target.value as string);
  };

  return (
    <FormControl
      variant="outlined"
      className={className}
      disabled={disabled}
      fullWidth
    >
      {/* Label */}
      {label !== '' && (
        <StyledFormLabel required={required}>{label}</StyledFormLabel>
      )}

      {/* Helper text */}
      {helperText !== '' && helperPosition === 'top' && (
        <StyledFormHelperText>{helperText}</StyledFormHelperText>
      )}

      {/* Input field */}
      {type === 'input' && (
        <StyledOutlinedInput
          type={inputType}
          placeholder={inputPlaceholder}
          required={required}
          value={inputValue}
          startAdornment={inputStartIcon}
        />
      )}

      {/* Select field */}
      {type === 'select' && (
        <StyledSelect value={selectValueState} onChange={handleChange}>
          {options.map((current, index) => {
            return (
              <MenuItem value={current[0]} key={index}>
                {current[1]}
              </MenuItem>
            );
          })}
        </StyledSelect>
      )}

      {/* Checkboxes or Radios */}
      {(type === 'checkbox' || type === 'radio') &&
        options.map((current, index) => {
          const icon =
            type === 'checkbox' ? (
              <Checkbox icon={checkboxIcon} checkedIcon={checkboxCheckedIcon} />
            ) : (
              <Radio
                name={radioName}
                icon={radioIcon}
                checkedIcon={radioCheckedIcon}
              />
            );

          const val = type === 'checkbox' ? current[0] : radioValue;

          return (
            <FormControlLabel
              control={icon}
              value={val}
              label={current[1]}
              labelPlacement={labelPlacement}
              checked={checked}
              key={index}
            />
          );
        })}

      {/* Helper text */}
      {helperText !== '' && helperPosition === 'bottom' && (
        <StyledFormHelperText>{helperText}</StyledFormHelperText>
      )}
    </FormControl>
  );
};
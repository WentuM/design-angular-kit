import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  CAP_REGEX,
  EMAIL_REGEX,
  ITALIAN_TAX_CODE_REGEX,
  PHONE_NUMBER_REGEX,
  URL_REGEX,
  VAT_NUMBER_REGEX
} from '../utils/regex';

export class ItValidators {
  public static SpecialCharacterPattern = '!@#$%&*_+=;:|,.';

  /**
   * Static pattern validator with custom error
   * @param regex
   * @param error
   */
  public static customPattern(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  /**
   * Set Validator if the condition is satisfied
   * @param validator the validator to apply if the condition is true
   * @param condition the condition
   */
  public static conditional(validator: ValidatorFn, condition: (control: AbstractControl) => boolean): ValidatorFn {
    return formControl => {
      if (!formControl.parent) {
        return null;
      }
      if (condition(formControl)) {
        return validator(formControl);
      }
      return null;
    };
  }

  /**
   * Check whether our password and confirm password are a match
   * @param control
   */
  public static passwordMatch(control: AbstractControl): AbstractControl | null {
    const confirmControl = control.get('passwordConfirm'); //confirmPassword form control
    if (!confirmControl) {
      return null;
    }

    const password = control.get('password')?.value; // get password from our password form control

    // compare is the password match
    if ((password && !confirmControl.value) || (confirmControl.value && password !== confirmControl.value)) {
      // if they don't match, set an error in our confirmPassword form control
      confirmControl?.setErrors({ noPasswordMatch: true });
      confirmControl?.markAsTouched();
      return control;
    }

    if (password) {
      confirmControl?.markAsTouched();
    }
    return null;
  }

  /**
   * Password validator
   * @param minLength minimum password length - default 10
   * @param hasNumber check whether the entered password has a number - default true
   * @param hasCapitalCase check whether the entered password has upper case letter - default true
   * @param hasSmallCase check whether the entered password has a lower-case letter - default true
   * @param hasSpecialCharacters check whether the entered password has a special character - default true
   */
  public static password(minLength = 10, hasNumber = true, hasCapitalCase = true, hasSmallCase = true, hasSpecialCharacters = true): ValidatorFn {
    return <ValidatorFn>Validators.compose([
      Validators.required,
      ItValidators.customPattern(/\d/, { hasNumber: hasNumber }),
      ItValidators.customPattern(/[A-Z]/, { hasCapitalCase: hasCapitalCase }),
      ItValidators.customPattern(/[a-z]/, { hasSmallCase: hasSmallCase }),
      ItValidators.customPattern(new RegExp(`[${ItValidators.SpecialCharacterPattern}]`), { hasSpecialCharacters: hasSpecialCharacters }),
      Validators.minLength(minLength)
    ]);
  }

  /**
   * Email validator
   */
  public static get email(): ValidatorFn {
    return <ValidatorFn>Validators.compose([
      Validators.email,
      ItValidators.customPattern(EMAIL_REGEX, { invalidEmail: true })
    ]);
  }

  /**
   * Phone number validator
   */
  public static get tel(): ValidatorFn {
    return ItValidators.customPattern(PHONE_NUMBER_REGEX, { invalidTel: true });
  }

  /**
   * URL validator
   */
  public static get url(): ValidatorFn {
    return ItValidators.customPattern(URL_REGEX, { invalidUrl: true });
  }

  /**
   * Italian Tax Code validator
   */
  public static get taxCode(): ValidatorFn {
    return ItValidators.customPattern(ITALIAN_TAX_CODE_REGEX, { invalidTaxCode: true });
  }

  /**
   * VAT Number validator
   */
  public static get vatNumber(): ValidatorFn {
    return ItValidators.customPattern(VAT_NUMBER_REGEX, { invalidVatNumber: true });
  }

  /**
   * Italian Postal Code validator (CAP)
   */
  public static get cap(): ValidatorFn {
    return ItValidators.customPattern(CAP_REGEX, { invalidCap: true });
  }

  /**
   * Check if value is a valid RegExp
   */
  public static get regExp(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (control?.value) {
          new RegExp(control.value);
        }
      } catch (e) {
        return { invalidRegex: true };
      }
      return null;
    };
  }
}

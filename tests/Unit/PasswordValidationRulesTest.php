<?php

declare(strict_types=1);

use App\Actions\Fortify\PasswordValidationRules;
use Illuminate\Validation\Rules\Password;

it('validates password validation rules trait', function () {
    // Simply test that the trait exists with the right method
    expect(trait_exists(PasswordValidationRules::class))->toBeTrue();

    // Test that the trait's method produces a rule containing Password class
    // by using reflection to access the protected method
    $reflectionClass = new ReflectionClass(PasswordValidationRules::class);
    $method = $reflectionClass->getMethod('passwordRules');

    // We can test that the method is protected
    expect($method->isProtected())->toBeTrue();

    // Create a test class that uses the trait
    $testObject = new class
    {
        use PasswordValidationRules;

        // Expose the protected method for testing
        public function getPasswordRulesForTest()
        {
            return $this->passwordRules();
        }
    };

    $passwordRules = $testObject->getPasswordRulesForTest();

    // Convert Laravel rule objects to strings for easier assertion
    $rulesArray = collect($passwordRules)->map(function ($rule) {
        if (is_object($rule)) {
            return get_class($rule);
        }

        return $rule;
    })->toArray();

    // Check that our rules array contains the essential rules
    expect($rulesArray)->toContain('required');
    expect($rulesArray)->toContain('string');
    expect($rulesArray)->toContain('confirmed');

    // Check the Password rule object exists
    $validationRuleExists = collect($rulesArray)->contains(function ($rule) {
        return $rule === Password::class || mb_strpos($rule, 'Password') !== false;
    });

    expect($validationRuleExists)->toBeTrue();
});

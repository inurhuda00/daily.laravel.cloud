<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';

    public static function getRoles(): array
    {
        return array_map(fn($role) => $role->value, self::cases());
    }

    public static function toArray(): array
    {
        $array = [];

        foreach (self::cases() as $case) {
            $array[$case->value] = ucwords($case->value);
        }

        return $array;
    }

    public static function toValues(): array
    {
        return array_keys(self::toArray());
    }

    public static function toLabels(): array
    {
        return array_values(self::toArray());
    }
}

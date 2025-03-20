<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CalendarConfig;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'user_id' => $this->generateUserId($request->name),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $config = CalendarConfig::create([
            'user_id' => $user->user_id,
            'show_weekend' => false,
            'start_time' => '08:00',
            'end_time' => '20:00',
            'max_appointments' => 1,
            'business_days' => [1, 2, 3, 4, 5]
        ]);
        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }

    private function generateUserId($name)
    {
        $nameParts = explode(' ', $name);
        $initials = '';

        foreach ($nameParts as $part) {
            $initials .= strtoupper(substr($part, 0, 2));
        }

        $number = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return substr($initials, 0, 4) . $number;
    }
}

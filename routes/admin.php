<?php

use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Middleware\ValidateAdminUser;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', ValidateAdminUser::class])->group(
    function () {
        Route::get('admin/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        Route::get('admin/dashboard/analitics', function () {
            return Inertia::render('Admin/Analitics');
        })->name('admin.analitics');

        Route::get('admin/dashboard/reports', function () {
            return Inertia::render('Admin/Reports');
        })->name('admin.reports');

        Route::get('admin/sales', function () {
            return Inertia::render('Admin/Sales/Index');
        })->name('admin.sales');

        Route::get('admin/users', function () {
            return Inertia::render('Admin/Users/Index');
        })->name('admin.users');

        Route::get('admin/membership', function () {
            return Inertia::render('Admin/Membership/Index');
        })->name('admin.memberships');

        Route::get('admin/plans', [SubscriptionPlanController::class, 'index'])->name('admin.plans.index');
        Route::post('admin/plans', [SubscriptionPlanController::class, 'store'])->name('admin.plans.store');
        Route::patch('admin/plans/{plan}', [SubscriptionPlanController::class, 'update'])->name('admin.plans.update');

        Route::get('admin/errors', function () {
            return Inertia::render('Admin/Logs/Index');
        })->name('admin.error.logs');
    }

);

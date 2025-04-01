<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(
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

        Route::get('admin/plans', function () {
            return Inertia::render('Admin/Plans/Index');
        })->name('admin.plans');

        Route::get('admin/errors', function () {
            return Inertia::render('Admin/Logs/Index');
        })->name('admin.error.logs');
    }

);

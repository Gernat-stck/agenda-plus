<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::with('user')->get();
        return view('admin.index', compact('admins'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admin,email',
            'role' => 'required|string|max:255',
        ]);

        Admin::create($request->all());

        return redirect()->route('admin.index')->with('success', 'Admin created successfully.');
    }
}

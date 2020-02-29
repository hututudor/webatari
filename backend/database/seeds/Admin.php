<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class Admin extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new \App\User();
        $user->name = "admin";
        $user->email = "admin@admin.com";
        $user->password = Hash::make("admin");
        $user->admin = 1;
        $user->save();
    }
}

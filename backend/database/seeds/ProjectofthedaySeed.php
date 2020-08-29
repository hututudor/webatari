<?php

use Illuminate\Database\Seeder;

class ProjectofthedaySeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('projectofthedays')->insert([
            'uuid' => 0,
        ]);
    }
}

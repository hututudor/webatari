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
       $project = new \App\Projectoftheday();
       $project->save();
    }
}

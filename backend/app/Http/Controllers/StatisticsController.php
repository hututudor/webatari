<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Project;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function statistics()
    {
        $users = User::all()->count();
        $projects = Project::all()->count();
        $comments = Comment::all()->count();
        $weeklyprojects = Project::where('created_at', '>=', Carbon::now()->subWeek())->get()->count();
        $weeklycomments = Comment::where('created_at', '>=', Carbon::now()->subWeek())->get()->count();
        $dailyprojects = Project::where('created_at', '>=', Carbon::now()->subDay())->get()->count();
        $dailycomments = Comment::where('created_at', '>=', Carbon::now()->subWeek())->get()->count();

        $projectsclass = Project::all();
        $lines=0;
        foreach($projectsclass as $project){
            $code = $project->code;
            $lines = $lines +1;
            $lines= $lines + substr_count( $code, PHP_EOL );
        }
        $stats=[
            'users' => $users,
            'projects' => $projects,
            'comments' => $comments,
            'weeklyprojects' => $weeklyprojects,
            'weeklycomments' => $weeklycomments,
            'lines' => $lines,
            'dailyprojects' => $dailyprojects,
            'dailycomments' => $dailycomments
            ];

        return response()->json(compact('stats'), 200);
    }
}

<?php

namespace App;

use App\Http\Controllers\AuthController;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $with = ['user'];
    protected $appends = ['liked'];

    public function getLikedAttribute()
    {
        $user = AuthController::getAuth();

        if ($user) {
            if (Commentlike::where('user_id', $user->id)->where('comment_id', $this->id)->first()) {
                return true;
            }
        }

        return false;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

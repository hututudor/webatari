<?php

namespace App;

use App\Http\Controllers\AuthController;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $with = ['user'];
    protected $appends = ['liked'];

    public function getLikedAttribute()
    {
        $user = AuthController::getAuth();

        if ($user) {
            if (Like::where('user_id', $user->id)->where('project_uuid', $this->uuid)->first()) {
                return true;
            }
        }

        return false;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

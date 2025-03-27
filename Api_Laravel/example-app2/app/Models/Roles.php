<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'rol_id';
    public $timestamps = false;

    protected $fillable = ['rol_nombre'];

    //relación con los usuarios

    public function usuarios() {
        return $this->hasMany(User::class, 'rol_id', 'rol_id');
    }
}

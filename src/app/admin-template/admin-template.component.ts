import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent {
 constructor(public authService : AuthenticationService,
  private router:Router){}

  handleLogout(){
    this.authService.logout().subscribe({
      next : (data)=> {
        this.router.navigateByUrl("/login")
      }
    })
  }
}

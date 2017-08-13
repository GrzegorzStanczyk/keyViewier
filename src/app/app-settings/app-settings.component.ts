import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {
  isDarkTheme: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  changeTheme(): void {
    if (this.isDarkTheme) {
       this.isDarkTheme = false;
    } else {
       this.isDarkTheme = true;
    }
 }

}

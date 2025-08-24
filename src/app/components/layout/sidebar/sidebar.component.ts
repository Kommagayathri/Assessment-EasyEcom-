import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Company List', path: '/companies', icon: '📋' },
    { label: 'New Company', path: '/companies/new', icon: '➕' }
  ];
}
// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-sidebar',
//   imports: [RouterModule, CommonModule],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css'
// })
// export class SidebarComponent {
//   activeMenu: string = 'companyList';

//   constructor(private router: Router) {}

//   setActiveMenu(menu: string) {
//     this.activeMenu = menu;
//     if (menu === 'companyList') {
//       this.router.navigate(['/companies']);
//     } else if (menu === 'newCompany') {
//       this.router.navigate(['/companies/new']);
//     }
//   }

//   handleNewCompany() {
//     this.activeMenu = 'newCompany';
//     this.router.navigate(['/companies/new']);
//   }
// }


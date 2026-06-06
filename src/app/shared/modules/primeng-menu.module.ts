import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';

@NgModule({

  exports: [

    MenubarModule,

    DrawerModule,

    MenuModule,

    BadgeModule

  ]

})

export class PrimeNgMenuModule {}
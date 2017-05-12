import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {ImageService} from "./service/image.service";
import { FileSelectComponent } from './input/file-select/file-select.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
    MdButtonModule, MdGridListModule, MdToolbarModule, MdSidenavModule, MdTabsModule,
    MdProgressBarModule
} from "@angular/material";
import { HeaderComponent } from './header/header/header.component';
import { FaceRecoEmotionComponent } from './face-reco-emotion/face-reco-emotion.component';
import {Routes, RouterModule} from "@angular/router";
import { VideoComponent } from './input/video/video.component';
import { FolderSelectComponent } from './input/folder-select/folder-select.component';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/reco-emotion',
        pathMatch: 'full'
    },
    // {
    //     path: 'norm',
    //     component: FaceNormComponent
    // },
    // {
    //     path: 'swap',
    //     component: FaceSwapComponent
    // },
    // {
    //     path: 'average',
    //     component: FaceAverageComponent
    // },
    // {
    //     path: 'cool-dirty',
    //     component: FaceCoolDirtyComponent
    // },
    {
        path: 'reco-emotion',
        component: FaceRecoEmotionComponent,
        pathMatch: 'full'
    },
    // {
    //     path: 'make-emotion',
    //     component: FaceMakeEmotionComponent
    // },
    // {
    //     path: 'viewer',
    //     component: FaceListComponent
    // }
];

@NgModule({
  declarations: [
    AppComponent,
    FileSelectComponent,
    HeaderComponent,
    FaceRecoEmotionComponent,
    VideoComponent,
    FolderSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
      RouterModule.forRoot(appRoutes, { useHash: true }),
      BrowserAnimationsModule,
      MdButtonModule,
      MdGridListModule,
      MdToolbarModule,
      MdSidenavModule,
      MdTabsModule,
      MdProgressBarModule
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

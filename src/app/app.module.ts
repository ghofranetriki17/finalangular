import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Core Module
import { CoreModule } from './core/core.module';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { DesignerModule } from './designer/designer.module';
import { PublicModule } from './public/public.module';

// Main App Component
import { AppComponent } from './app.component';

// App Routing
import { AppRoutingModule } from './app-routing.module';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Firebase Modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    
    // Core & Shared Modules
    CoreModule,
    MatIconModule,
    
    // Feature Modules (these should be lazy-loaded via routing)
    // AuthModule,  // Commented out because it should be lazy-loaded
    // AdminModule, // Commented out because it should be lazy-loaded
    // DesignerModule, // Commented out because it should be lazy-loaded
    // PublicModule, // Commented out because it should be lazy-loaded
    PublicModule,

    // App Routing (should be last)
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
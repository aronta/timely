import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [CommonModule, RouterModule, FormsModule],
})
export class SharedModule {}

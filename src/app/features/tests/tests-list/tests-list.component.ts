import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TestsService } from '../../../shared/services/tests.service';
import { SubTest, Test } from '../../../shared/models/test';
import { TestDialogComponent } from '../test-dialog/test-dialog.component';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrl: './tests-list.component.css'
})
export class TestsListComponent {
  displayedColumns: string[] = [
    'name',
    'unit',
    'range',
    'method',
    'sample',
    'price',
    'status',
    'actions',
  ];

  tests: Test[] = [];
  constructor(private testsSvc: TestsService, private dialog: MatDialog) {
    this.refresh();
  }

  refresh() {
    this.tests = this.testsSvc.getAll();
  }

  // toggle(t: Test) {
  //   this.testsSvc.toggleEnabled(t.id);
  //   this.refresh();
  // }

  // add() {
  //   const ref = this.dialog.open(TestDialogComponent, { data: { mode: 'add' }, width: '500px' });
  //   ref.afterClosed().subscribe(res => { if (res) { this.testsSvc.add(res); this.refresh(); } });
  // }

  edit(t: Test) {
    const ref = this.dialog.open(TestDialogComponent, { data: { mode: 'edit', test: t }, width: '500px' });
    ref.afterClosed().subscribe(res => { if (res) { this.testsSvc.update(t.id, res); this.refresh(); } });
  }

  remove(t: Test) {
    this.testsSvc.remove(t.id);
    this.refresh();
  }
  add() {
    console.log('Add test');
  }

  toggle(t: Test) {
    t.enabled = !t.enabled;
  }

  addSubTest(test: Test) {
    console.log('Add subtest for', test.name);
  }
    toggleSubTest(test: Test, sub: SubTest) {
    sub.enabled = !sub.enabled;
  }

  editSubTest(test: Test, sub: SubTest) {
    console.log('Edit subtest', sub.name, 'of', test.name);
  }

  deleteSubTest(test: Test, sub: SubTest) {
    test.subTests = test.subTests.filter((x) => x !== sub);
  }
}

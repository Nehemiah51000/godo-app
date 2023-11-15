export enum EProjectTypeBehavior {
  //allows a user to add tasks to the root project that is the leafy state
  //Also helps impliment a guard where the user  cannot make a rooproject a leafy project by adding tasks
  //However a user can create a new root project with leafy characteristics by choosing project type behviour as leafy.
  //Therefore, the user can add tasks directly to the root project

  NORMAL = 'normal',
  LEAFY = 'leafy',
}

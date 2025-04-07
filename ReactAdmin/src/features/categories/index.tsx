import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/categories-columns';
import { CategoriesDialogs } from './components/categoriesDialogs';
import { CategoriesPrimaryButtons } from './components/categoriesPrimaryButtons';
import { CategoriesTable } from './components/data-table';
import CategoriesProvider from './context/categories-context';

export default function Categories() {
  return (
    <CategoriesProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Category List</h2>
            <p className="text-muted-foreground">
              Manage your categories and subcategories here.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {/* Data is passed dynamically through context; remove static data prop */}
          <CategoriesTable columns={columns} data={[]} />
        </div>
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  );
}

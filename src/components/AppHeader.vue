<template>
  <header class="sticky top-4 z-50 mx-auto mt-4 w-auto max-w-xl px-4">
    <div
      class="rounded-2xl border border-gray-200/60 bg-white/75 px-6 py-3 shadow-2xl backdrop-blur-xl"
    >
      <div class="flex items-center justify-between gap-4">
        <RouterLink
          to="/"
          class="truncate text-sm font-bold text-gray-900 transition-colors hover:text-blue-700"
        >
          CMIP7 Dashboard
        </RouterLink>
        <nav class="flex items-center gap-3 whitespace-nowrap text-sm">
          <RouterLink
            to="/"
            class="font-medium text-gray-600 transition-colors hover:text-gray-900"
            exact-active-class="!font-bold !text-gray-900"
          >
            Home
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

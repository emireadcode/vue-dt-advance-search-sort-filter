// javascript program for 3-way quick sort

let i = 0, j = 0;

/*
* This function partitions a in three parts a) a[l..i] contains all elements
* smaller than pivot b) a[i+1..j-1] contains all occurrences of pivot c)
* a[j..r] contains all elements greater than pivot
*/

function partition(b: number[] , l: number , r: number) {
  console.log(b+' xxx');
  let
	a = b,
  	i = l - 1,
	j = r,
	p = l - 1, 
	q = r,
	v = b[r]
  ;

  while (true) {

    // From left, find the first element greater than
	// or equal to v. This loop will definitely
	// terminate as v is last element
	while (a[++i] < v)
	  ;

	// From right, find the first element smaller than
	// or equal to v
	while (v < a[--j])
	  if (j == l)
	    break;

	// If i and j cross, then we are done
	if (i >= j)
	  break;

	// Swap, so that smaller goes on left greater goes
	// on right
	let temp = a[i];
	a[i] = a[j];
	a[j] = temp;

	// Move all same left occurrence of pivot to
	// beginning of array and keep count using p
	if (a[i] == v) {
	  p++;
	  temp = a[i];
	  a[i] = a[p];
	  a[p] = temp;
	}

	// Move all same right occurrence of pivot to end of
	// array and keep count using q
	if (a[j] == v) {
	  q--;
	  temp = a[q];
	  a[q] = a[j];
	  a[j] = temp;
	}
  }

  // Move pivot element to its correct index
  let temp = a[i];
  a[i] = a[r];
  a[r] = temp;

  // Move all left same occurrences from beginning
  // to adjacent to arr[i]
  j = i - 1;
  for (let k = l; k < p; k++, j--) {
	temp = a[k];
	a[k] = a[j];
	a[j] = temp;
  }

  // Move all right same occurrences from end
  // to adjacent to arr[i]
  i = i + 1;
  for (let k = r - 1; k > q; k--, i++) {
	temp = a[i];
	a[i] = a[k];
	a[k] = temp;
  }

  return a;
}

// 3-way partition based quick sort
export function quicksort(b: number[] , l: number , r: number) {
  let 
	a = b,
	i = 0,
	j = 0
  ;
  console.log(a);
  if (r <= l)
	return;

  // Note that i and j are passed as reference
  a = partition(a, l, r) as number[];
  // Recur
  a = quicksort(a, l, j) as number[];
  a = quicksort(a, i, r) as number[];

  return a;
}

//var a = [ 4, 9, 4, 4, 1, 9, 4, 4, 9, 4, 4, 1, 4 ];
//var size = a.length;
//quicksort(a, 0, size - 1);

// This code contributed by aashish1995

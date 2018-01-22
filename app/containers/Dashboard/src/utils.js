// The MIT License (MIT)
//
// Copyright (c) 2016 Vivek Kumar Bansal
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


export function sum(node) {
  console.log("node from utils", node)
    if (node.children && node.children.length) {
        let d = 0,
            i = -1,
            n = node.children.length;

        while (++i < n) d += sum(node.children[i]);

        return d;
    }

    return node.size;
}

export function flatten(data, level = 1, path = ""){
    let flat = [];

    flat.push({
        name: data.name,
        size: data.size,
        level,
        path
    });

    if (data.children && data.children.length) {
        let i = -1,
            n = data.children.length;

        while (++i < n) flat.push(...flatten(data.children[i], level + 1, path ? `${path}-${i}` : `${i}`));
    }

    return flat;
}

export function depth(node) {
    let d = 0;

    if (node.children && node.children.length) {
        let i = -1,
            n = node.children.length;

        while (++i < n) d = Math.max(d, depth(node.children[i]));
    }

    return 1 + d;
}

export function findSum(data, level = 1) {

    data.size = sum(data);

    if (data.children && data.children.length) {
        let i = -1,
            n = data.children.length;

        while (++i < n) data.children[i] = findSum(data.children[i]);

        data.children.sort((a,b) => b.size - a.size);
    }

    return data;
}
